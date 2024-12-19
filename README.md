React TS OS
===========

🖇 https://react-ts-os.vercel.app/

## Create new window

1. Create a new component in `src/components/windows/`, for example `src/components/windows/MyWindow.tsx`:

```tsx
export const MyWindow = (props: {
  mywindowprops?: string
}) => {
  return <div>
    {props.mywindowprops ? <p>{props.mywindowprops}</p> : <p>no props</p>}
  </div>
}
```

2. Add the new window to property `window`of the `WindowManager` service in `src/services/WindowManager.ts`:

```ts
class WindowManager {
  private windows: { [key: string]: Window } = {
    // ...
    "mywindow": {
      component: MyWindow, // The component of the window
      title: "My Window", // The title of the window
      icon: JSXIconForMyWindow, // A tsx component that represents the icon of the window
    },
  }

  // ...
}
```

## Create new setting and import it in your component

1. Create a new setting in `src/services/Settings.ts`:

```ts
class Settings {
  private preferences: { [key: string]: PreferencesSection } = {
    // ...
    mysettingsection: {
      title: "My Setting Section",
      properties: {
        mysetting: {
          name: "My Setting",
          type: "text",
          value: "default value",
        },
      },
    },
  }

  // ...
}
```

2. Import the setting in your component:

```tsx
export const MyWindow = (props: {
  mywindowprops?: string
}) => {
  const [mysetting] = useSetting("mysettingsection", "mysetting")
  return <div>
    <p>{mysetting}</p>
    {props.mywindowprops ? <p>{props.mywindowprops}</p> : <p>no props</p>}
  </div>
}
```


-------------------

TODO :

- Add User and sessions
- Handle file permissions
- Fix activity monitor bug
- update instantly display when file is created/deleted (e.g. i create a file with a command in the term, i want to see
  it in the file explorer directly)
- Handle file creation directly in the editor