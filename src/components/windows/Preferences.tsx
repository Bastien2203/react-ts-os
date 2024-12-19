import {useContext, useState} from "react";
import {WindowManagerContext} from "../../WindowManagerContext.tsx";
import {FileManager} from "../../services/FileManager.ts";

export const Preferences = () => {

  const context = useContext(WindowManagerContext);
  const preferences = context?.windowManager.settings.preferences;


  const updatePreferences = (section: string, property: string, value: any) => {
    context?.windowManager.settings.updateProperty(section, property, value);
  }

  if (!preferences) {
    return <></>;
  }

  return (
    <div className="flex flex-col h-full p-4 select-none">
      <div>
        {
          Object.keys(preferences).map((sectionKey, index) => {
            const section = preferences[sectionKey];
            return (
              <details key={index} className="mb-4">
                <summary className="text-lg font-bold cursor-pointer">
                  {section.name}
                </summary>
                <div className="grid grid-cols-1 gap-4 mt-2 ml-5">
                  {
                    Object.keys(section.properties).map((propertyKey, index) => {
                      const [info, setInfo] = useState<string>();
                      const property = section.properties[propertyKey];
                      return (
                        <div key={index} className="flex flex-col">
                          <label className="text-sm">{property.name}</label>
                          {
                            property.type === "color" ? (
                              <div className="flex items-center gap-4 select-text">
                                <input type="color" defaultValue={property.value}
                                       className="w-20 mt-1 bg-transparent cursor-pointer"
                                       onChange={(e) => {
                                         updatePreferences(sectionKey, propertyKey, e.target.value);
                                       }}/>
                                {property.value}
                              </div>

                            ) : property.type === "path" ? (
                                <>
                                  <input type="text" defaultValue={property.value}
                                         className="w-full mt-1 bg-transparent border-b border-gray-400 select-text"
                                         onChange={(e) => {
                                           try {
                                             FileManager.getFile(e.target.value)
                                             setInfo(undefined);
                                             const path = e.target.value.endsWith("/") ? e.target.value : e.target.value + "/";
                                             updatePreferences(sectionKey, propertyKey, path);
                                             e.target.value = path;
                                           } catch (e) {
                                             setInfo("Invalid path");
                                           }
                                         }}/>
                                  {
                                    info && <span className="text-red-500">{info}</span>
                                  }
                                </>
                              ) :
                              (
                                <input type="text" defaultValue={property.value}
                                       className="w-full mt-1 bg-transparent border-b border-gray-400 select-text"
                                       onChange={(e) => {
                                         updatePreferences(sectionKey, propertyKey, e.target.value);
                                       }}/>
                              )
                          }
                        </div>
                      )
                    })
                  }
                </div>
              </details>
            )
          })
        }
      </div>

    </div>
  );
};
