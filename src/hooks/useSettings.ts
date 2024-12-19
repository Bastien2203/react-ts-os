import {useContext, useEffect, useState} from "react";
import {WindowManagerContext} from "../WindowManagerContext.tsx";

export function useSettings(section: string, property: string) {
  const context = useContext(WindowManagerContext);
  const [settings, setSettings] = useState<string>(context?.windowManager.settings.preferences[section].properties[property].value);

  const updateSettings = (value: any) => {
    context?.windowManager.settings.updateProperty(section, property, value);
  }

  useEffect(() => {
    const onSettingsChanged = (value: any) => {
      setSettings(value);
    }

    context?.windowManager.eventManager.on(`settings:${section}:${property}`, onSettingsChanged);

    return () => {
      context?.windowManager.eventManager.off(`settings:${section}:${property}`, onSettingsChanged);
    };
  }, [context]);


  return [settings, updateSettings] as const;
}