import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";

export default interface ControlRenderer<T extends Control = Control> {
    apiVersion: 2,
    render: (rm: RenderManager, control: T) => void;
}