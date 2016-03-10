declare module "react-select" {
    // Import React
    import React = require("react");

    interface Option{
        label : string;
        value : string;
    }

    interface ReactSelectProps extends React.Props<ReactSelectClass>{
        addLabelText? : string;
        allowCreate? : boolean;
        autoload? : boolean;
        backspaceRemoves? : boolean;
        cacheAsyncResults? : boolean;
        className? : string;
        clearable? : boolean;
        clearAllText? : string;
        clearValueText? : string;
        delimiter? : string;
        disabled? : boolean;
        filterOption? : (option : Option,filterString : string)=>Option;
        filterOptions? : (options:Array<Option>,filterString : string,values : Array<Object>)=>Array<Option>;
        ignoreCase? : boolean; // default true	whether to perform case-insensitive filtering
        inputProps? : Object;
        isLoading? : boolean;
        labelKey? : string;
        matchPos? : string;
        matchProp? : string;
        multi? : boolean;
        name? : string;
        newOptionCreator? : ()=>Option;
        noResultsText? : string;
        onBlur? : (event : Event)=>void;
        onChange? : (newValue : string)=>void;
        onFocus? : (event : Event)=>void;
        onInputChange? : (inputValue : string)=>void;
        onOptionLabelClick? : (value : string, event : Event)=>void;
        optionRenderer? : ()=>void;
        options? : Array<Option>;
        placeholder? : string;
        searchable? : boolean;
        searchingText? : string;
        searchPromptText? : string;
        value? : string|Option;
        valueKey? : string;
        valueRenderer? : ()=>void;
    }

    interface ReactAsyncSelectProps extends React.Props<ReactSelectClass>{
        cache? : any;
        loadOptions? : ()=>void;
        ignoreAccents? : boolean;
        isLoading? : boolean;
        loadingPlaceholder? : string;
    }

    interface ReactSelect extends  React.ReactElement<ReactSelectProps> { }
    interface ReactSelectClass extends React.ComponentClass<ReactSelectProps>{}

    interface SelectWithAsync extends ReactSelectClass {
        Async? : ReactAsyncSelectProps;
    }

    var ReactSelect: SelectWithAsync;

    export default ReactSelect;
}
