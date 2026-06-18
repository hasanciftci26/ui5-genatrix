import Event from "sap/ui/base/Event";
import Model from "sap/ui/model/Model";
import { PropertyConstraintType } from "ui5/genatrix/form/enum/PropertyConstraintType";
import PropertyConstraint from "ui5/genatrix/form/PropertyConstraint";
import ChangeManager from "ui5/genatrix/odata/ChangeManager";
import ContextManagerBase from "ui5/genatrix/odata/ContextManagerBase";

export type ChangeManagerSettings = {
    model: Model;
    contextManager: ContextManagerBase;
    propertyConstraints: PropertyConstraint[];
};

export type ChangeManager$ApplyConstraintEventParameters = {
    property: string;
    type: PropertyConstraintType | keyof typeof PropertyConstraintType;
    value: boolean;
};

export type ChangeManager$ApplyConstraintEvent = Event<ChangeManager$ApplyConstraintEventParameters, ChangeManager>;
export type ChangeManager$ApplyConstraintEventHandler = (event: ChangeManager$ApplyConstraintEvent) => void;