import {EventManager} from "./EventManager.ts";

interface PreferencesSection {
  name: string;
  properties: { [key: string]: SectionProperty };
}

interface SectionProperty {
  name: string;
  type: string;
  value: any;
}

export class Settings {
  constructor(private eventManager: EventManager) {
  }


  preferences: { [key: string]: PreferencesSection } = {
    appearance: {
      name: "Appearance",
      properties: {
        windowBackgroundColor: {
          name: "Window Background Color",
          type: "color",
          value: "#0F172A"
        },
        windowLayoutBackgroundColor: {
          name: "Window Layout Background",
          type: "color",
          value: "#979797"
        },
        desktopBackgroundColor: {
          name: "Desktop Background",
          type: "text",
          value: `linear-gradient(to bottom right, #1f2c4c, #574e4e)`
        }
      }
    },
    paths: {
      name: "Paths",
      properties: {
        desktop: {
          name: "Desktop",
          type: "path",
          value: "/Desktop/"
        }
      }
    }
  }

  updateProperty(section: string, property: string, value: any) {
    this.preferences[section].properties[property].value = value;
    this.eventManager.emit(`settings:${section}:${property}`, value);
  }

}
