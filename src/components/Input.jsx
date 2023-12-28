import { component$ } from "@builder.io/qwik";
import { randomString } from "~/utils.js";

/**
 * @typedef {import('@builder.io/qwik').QwikIntrinsicElements['textarea']} TextareaAttributes
 */

/**
 * @type {Component<TextareaAttributes  & {
 * label: string,
 * name: string,
 * id?: string,
 * value?: string
 * }>}
 */
export default component$((props) => {
  const id = props.id || randomString(8)

  return (
    <div>
      <label for={id}>{props.label}</label>
      <textarea id={id} {...props}>
        {/** @type {undefined} */ (props.value)}
      </textarea>
    </div>
  )
})