import {Theme} from "../../services/Theme.ts";


export const Editor = () => {
  return <textarea className="h-full w-full outline-0" style={{
    backgroundColor: Theme.windowBackgroundColor
  }} >

  </textarea>
}