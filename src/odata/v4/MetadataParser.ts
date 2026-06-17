import Context from "sap/ui/model/Context";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import MetadataParserBase from "ui5/genatrix/odata/MetadataParserBase";
import { EntityTypeProperty, MetadataParserBaseSettings } from "ui5/genatrix/types/odata/MetadataParserBase.types";

/**
 * @namespace ui5.genatrix.odata.v4
 */
export default class MetadataParser extends MetadataParserBase<ODataModel> {
    constructor(settings: MetadataParserBaseSettings<ODataModel>) {
        super(settings);
    }

    // TODO
    public async parse(context: Context) {
        const properties: EntityTypeProperty[] = [];
        return properties;
    }
}