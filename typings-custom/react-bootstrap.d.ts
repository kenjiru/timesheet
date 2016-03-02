declare module "react-bootstrap" {
    import * as React from "react";

    // <Collapse />
    // ----------------------------------------
    interface CollapsibleProps extends React.Props<CollapsibleClass> {
        className?: string,

        // Optional
        dimension?: string,
        getDimensionValue?: Function,
        in?: boolean
        onEnter?: Function,
        onEntered?: Function,
        onEntering?: Function,
        onExit?: Function,
        onExited?: Function,
        onExiting?: Function,
        role?: string,
        timeout?: number,
        transitionAppear?: boolean,
        unmountOnExit?: boolean
    }
    interface Collapse extends  React.ReactElement<CollapsibleProps> { }
    interface CollapsibleClass extends  React.ComponentClass<CollapsibleProps> { }
    var Collapse: CollapsibleClass;
}