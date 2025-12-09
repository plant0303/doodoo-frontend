import React from 'react'

function LicenseInfo() {
  return (
    <section className="mt-12 mb-16 p-6 border border-gray-100 rounded-lg">
      <h2 className="text-lg font-bold mb-5 text-gray-600 flex items-center border-b border-gray-200 pb-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-gray-400">
          <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L18.44 12l-6.47-6.47a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M7.47 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L12.94 12 6.47 5.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
        DooDoo License Policy
      </h2>

      <p className="text-xs text-gray-500 mb-6 leading-relaxed">
        All content downloaded from **DooDoo** may be used for commercial purposes under the terms below.
        <span className="font-semibold text-gray-600">No attribution is required.</span>
      </p>

      {/* --- Allowed Uses --- */}
      <h3 className="text-sm font-bold mb-3 text-gray-600 border-l-2 border-gray-300 pl-2">
        Allowed Uses
      </h3>

      <ul className="list-none space-y-2 mb-8 pl-0">
        {[
          "Online content: ads, marketing, social media, blogs, websites",
          "Video production: YouTube, shorts, broadcasts, corporate/agency promos",
          "Printed materials: flyers, posters, banners, brochures",
          "App, game, and UI/UX design",
          "Product packaging & brand materials (※ cannot be registered as a trademark/logo)",
          "Templates, thumbnails, presentations, and other derivative works",
        ].map((item, index) => (
          <li key={`allowed-${index}`} className="flex items-start text-xs text-gray-500">
            <span className="text-gray-400 font-bold mr-2 mt-0.5">·</span>
            {item}
          </li>
        ))}
      </ul>

      {/* --- Not Allowed --- */}
      <h3 className="text-sm font-bold mb-3 text-gray-600 border-l-2 border-gray-300 pl-2">
        Not Allowed
      </h3>

      <ul className="list-none space-y-2 pl-0">
        {[
          "Reselling, redistributing, or uploading the content to other stock platforms",
          "Using the content “as is” to create or register a trademark or logo",
          "Use in pornographic, violent, defamatory, or illegal content",
          "Using the content for AI training, model learning, or dataset creation",
          "Uses that violate privacy or publicity rights for identifiable persons",
        ].map((item, index) => (
          <li key={`not-allowed-${index}`} className="flex items-start text-xs text-gray-500">
            <span className="text-gray-400 font-bold mr-2 mt-0.5">·</span>
            {item}
          </li>
        ))}
      </ul>

      {/* <div className="mt-8 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            For complete and detailed terms, please visit the official <a href="/license" className="text-gray-600 hover:text-gray-700 font-medium underline transition duration-150">DooDoo License Page</a>.
          </p>
        </div> */}
    </section>
  )
}

export default LicenseInfo
