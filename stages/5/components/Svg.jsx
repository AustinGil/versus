import { component$ } from "@builder.io/qwik";

const definitions = {
  'icon-spinner': `<symbol viewBox="0 0 24 24" id="icon-spinner"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"></path><circle cx="12" cy="2.5" r="1.5" fill="currentColor"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform></circle></symbol>`
}

/**
 * @typedef {HTMLAttributes<SVGElement>} SVGAttributes
 */

/**
 * @type {Component<SVGAttributes & {
 * alt: string,
 * } & (
 * { href: keyof definitions, icon?: never } |
 * { icon: keyof definitions, href?: never }
 * )
 * >}
 */
export default component$(({ alt, href, icon, class: className, ...props }) => {

  return (
    <>
      <svg
        class={{
          [String(className)]: !!className,
          icon: !!icon,
          [String(icon)]: !!icon
        }}
        role="presentation"
        {...props}
      >
        <use href={`#${href || icon}`} />
      </svg>
      <span class="visually-hidden">{alt}</span>
    </>
  )
})

export const SvgDefinitions = component$(() => {
  return (
    <svg
      aria-hidden="true"
      style="position: absolute; width: 0; height: 0; overflow: hidden"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs dangerouslySetInnerHTML={Object.values(definitions).join('')}></defs>
    </svg>
  )
})