import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, extend } from '@react-three/fiber'; // useFrame 제거
import { Physics, usePlane, useSphere } from '@react-three/cannon';
import { Environment } from '@react-three/drei'; // OrbitControls 및 MeshPhysicalMaterial 제거

// MeshPhysicalMaterial은 THREE.js에 속하며, JSX에서 <meshPhysicalMaterial /> 형태로 사용하기 위해 extend해야 합니다.
// 이때 extend에 넘겨주는 이름은 three.js에서 가져와야 합니다.
extend({ MeshPhysicalMaterial: THREE.MeshPhysicalMaterial }); // THREE.MeshPhysicalMaterial을 정확하게 확장

// 1. 구체 하나를 렌더링하고 물리적 속성을 부여하는 컴포넌트
interface BallProps {
    position: [number, number, number];
    size: number;
    color: string;
}

const Ball: React.FC<BallProps> = ({ position, size, color }) => {
    const MAX_INITIAL_SPEED = 0.1; // 초기 최대 속도를 1에서 0.3으로 줄였습니다.
    // useSphere는 구체의 물리 바디를 생성하고 이를 3D Mesh와 연결합니다.
    const [ref] = useSphere<THREE.Mesh>(() => ({
        mass: 3, // 질량
        args: [size], // 구체의 반지름
        position,
        velocity: [
            Math.random() * 2 * MAX_INITIAL_SPEED - MAX_INITIAL_SPEED,
            Math.random() * 2 * MAX_INITIAL_SPEED - MAX_INITIAL_SPEED,
            Math.random() * 2 * MAX_INITIAL_SPEED - MAX_INITIAL_SPEED,
        ],
        restitution: 0.1, // 반발 계수 (탄성)
        friction: 0.5,
    }));

    return (
        <mesh ref={ref} castShadow receiveShadow>
            <sphereGeometry args={[size, 32, 32]} />
            {/* MeshPhysicalMaterial을 사용하여 광택 있고 반사되는 질감을 구현 */}
            <meshPhysicalMaterial
                color={color}
                roughness={0.3}
                metalness={0.5}
                clearcoat={0}
                clearcoatRoughness={0.1}
                reflectivity={0.2}
            />
        </mesh>
    );
};

// 2. 물리 엔진의 경계(벽)를 설정하는 컴포넌트
// Canvas viewport 크기에 맞게 6개의 Plane (바닥, 천장, 4개 벽)을 생성합니다.
const Boundary: React.FC = () => {
    const { viewport } = useThree();
    const width = viewport.width / 2;
    const height = viewport.height / 2;
    const depth = 0.5; // 깊이 (z축)

    // usePlane(fn, ref)는 물리 엔진에 무한 평면을 생성합니다.
    // fn에 정의된 rotation과 position에 따라 벽이 됩니다.

    // 바닥 & 천장 (Y축)
    usePlane(() => ({ position: [0, -height, 0], rotation: [-Math.PI / 2, 0, 0] }));
    usePlane(() => ({ position: [0, height, 0], rotation: [Math.PI / 2, 0, 0] }));

    // 좌우 벽 (X축)
    usePlane(() => ({ position: [-width, 0, 0], rotation: [0, Math.PI / 2, 0] }));
    usePlane(() => ({ position: [width, 0, 0], rotation: [0, -Math.PI / 2, 0] }));

    // 앞뒤 벽 (Z축)
    usePlane(() => ({ position: [0, 0, -depth], rotation: [0, 0, 0] }));
    usePlane(() => ({ position: [0, 0, depth], rotation: [0, Math.PI, 0] }));

    return null;
};

// 3. 마우스 커서를 따라다니며 오브젝트를 밀어내는 컴포넌트 (커서 충돌 구현)
const MousePusher: React.FC = () => {
    const { viewport, camera } = useThree();
    const raycaster = useMemo(() => new THREE.Raycaster(), []);
    const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

    // 커서의 물리 바디 (작은 구체)
    // mass를 매우 높게 설정하여 다른 공들을 쉽게 밀어내도록 합니다.
    const [cursorRef, api] = useSphere<THREE.Mesh>(() => ({
        mass: 1000,
        args: [0.1], // 매우 작은 크기
        type: 'Kinematic', // 외부 힘에 의해서만 움직이는 타입 (마우스에 의해 제어)
        position: [0, 0, 0],
        restitution: 0.5,
    }));

    // 마우스 움직임을 처리하는 콜백 함수
    const handlePointerMove = useCallback((event: PointerEvent) => {
        // 2D 마우스 좌표를 3D 월드 좌표로 변환
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Raycaster를 사용하여 마우스 위치를 3D 공간에 투영
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        const intersectPoint = raycaster.ray.intersectPlane(plane, new THREE.Vector3());

        if (intersectPoint) {
            // 커서 바디를 계산된 3D 위치로 이동
            // Z축은 0으로 고정하여 마우스가 평면(Boundary의 Z=0 면)에서만 움직이도록 합니다.
            api.position.set(intersectPoint.x, intersectPoint.y, 0);
        }
    }, [raycaster, camera, plane, api.position]);

    // Canvas 전체에 마우스 움직임 이벤트를 등록합니다.
    useEffect(() => {
        // DOM 이벤트 리스너를 추가합니다.
        window.addEventListener('pointermove', handlePointerMove as any);
        return () => window.removeEventListener('pointermove', handlePointerMove as any);
    }, [handlePointerMove]);

    // 커서의 물리 바디는 보이지 않도록 렌더링하지 않습니다.
    return (
        <mesh ref={cursorRef} visible={false}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="red" />
        </mesh>
    );
};

// 4. 메인 Ballpit 애니메이션 컴포넌트
const Ballpit: React.FC = () => {
    const NUM_BALLS = 10;
    const BALL_RADIUS_MIN = 0.2;
    const BALL_RADIUS_MAX = 0.6;
    const COLORS = ['#ff336d'];  // 광택 질감에 잘 어울리는 색상

    // Ball들의 초기 상태를 useMemo로 한 번만 생성합니다.
    const balls = useMemo(() => {
        return Array.from({ length: NUM_BALLS }).map(() => ({
            position: [
                (Math.random() - 0.5) * 5, // X: -2.5 ~ 2.5
                (Math.random() - 0.5) * 5, // Y: -2.5 ~ 2.5
                (Math.random() - 0.5) * 2, // Z: -1 ~ 1
            ] as [number, number, number],
            size: Math.random() * (BALL_RADIUS_MAX - BALL_RADIUS_MIN) + BALL_RADIUS_MIN,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
        }));
    }, [NUM_BALLS, COLORS]);

    return (
        // Tailwind CSS를 사용하여 전체 화면을 채웁니다.
        <div className="w-full h-screen bg-white absolute top-0 left-0 overflow-hidden">
            <Canvas
                shadows
                camera={{ position: [0, 0, 5], fov: 60 }} // 카메라 위치와 시야각 설정
                className="touch-none" // 모바일에서 터치 스크롤 대신 커서 움직임으로 인식되도록 설정
            >
                {/* Environment를 사용하여 주변광과 반사를 설정 (광택 질감 극대화) */}
                <Environment preset="city" blur={0.3} background={false} />

                {/* 라이팅 설정: 광택을 잘 표현하기 위한 조명 */}
                <ambientLight intensity={0.8} />
                <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={400} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={10} />

                {/* 물리 엔진 (중력 없음: [0, 0, 0]) */}
                <Physics gravity={[0, 0, 0]} allowSleep={false}>
                    {/* 볼들을 가둘 경계면 */}
                    <Boundary />
                    {/* 마우스 커서와 충돌하는 물리 오브젝트 */}
                    <MousePusher />
                    {/* 모든 볼 렌더링 */}
                    {balls.map((props, i) => (
                        <Ball key={i} {...props} />
                    ))}
                </Physics>
            </Canvas>
        </div>
    );
};

export default Ballpit;