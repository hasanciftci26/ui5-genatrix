export default interface PropertyConfigurationBase {
    getName: () => string | undefined;
    getLabel: () => string | undefined;
}