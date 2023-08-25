import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { SvgDefinitions } from './components/Svg.jsx'

import "./global.css";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        <footer class="my-10 sm:mt-20 px-4 text-center">
          <p>Built by <a href="https://austingil.com">Austin Gil</a>. Powered by <a href="https://akamai.com">Akamai Connected Cloud</a>.</p>
          <p><a href="https://linode.com/austingil">Get $100 in free cloud computing credits.</a></p>
        </footer>
        <ServiceWorkerRegister />
        <SvgDefinitions/>
      </body>
    </QwikCityProvider>
  );
});
