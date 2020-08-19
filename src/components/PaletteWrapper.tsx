/*
*  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as go from 'gojs';
import { ReactPalette } from 'gojs-react';
import * as React from 'react';

import './Palette.css';


interface PaletteProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray?: Array<go.ObjectData>;
  modelData?: go.ObjectData;
}



export class PaletteWrapper extends React.Component<PaletteProps, {}> {
  /**
   * Ref to keep a reference to the Diagram component, which provides access to the GoJS diagram via getDiagram().
   */
  private paletteRef: React.RefObject<ReactPalette>;

  /** @internal */
  constructor(props: PaletteProps) {
    super(props);
    this.paletteRef = React.createRef();
  }

  /**
   * Get the diagram reference and add any desired diagram listeners.
   * Typically the same function will be used for each listener, with the function using a switch statement to handle the events.
   */
  // public componentDidMount() {
  //   if (!this.paletteRef.current) return;
  //   const diagram = this.paletteRef.current.getDiagram();
  //   if (diagram instanceof go.Diagram) {
  //     diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);
  //   }
  // }

  /**
   * Get the diagram reference and remove listeners that were added during mounting.
   */
  // public componentWillUnmount() {
  //   if (!this.diagramRef.current) return;
  //   const diagram = this.diagramRef.current.getDiagram();
  //   if (diagram instanceof go.Diagram) {
  //     diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
  //   }
  // }

  /**
   * Diagram initialization method, which is passed to the ReactDiagram component.
   * This method is responsible for making the diagram and initializing the model, any templates,
   * and maybe doing other initialization tasks like customizing tools.
   * The model's data should not be set here, as the ReactDiagram component handles that.
   */
  private initPalette(): go.Palette {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const myPalette =
      $(go.Palette,
        {
          //用Gridlayout格子布局垂直排列每行数据
          layout: $(go.GridLayout, { alignment: go.GridLayout.Location }),
          model: $(go.GraphLinksModel,
            {
              linkKeyProperty: 'key',  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
              // positive keys for nodes
              makeUniqueKeyFunction: (m: go.Model, data: any) => {
                let k = data.key || 1;
                while (m.findNodeDataForKey(k)) k++;
                data.key = k;
                return k;
              },
              // negative keys for links
              makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
                let k = data.key || -1;
                while (m.findLinkDataForKey(k)) k--;
                data.key = k;
                return k;
              }
            })
        });

    // define a simple Node template
    myPalette.nodeTemplate =$(
      go.Node, "Vertical",
      { locationObjectName: "TB", locationSpot: go.Spot.Center },
      $(go.Shape,
        { width: 20, height: 20, fill: "white" },
        new go.Binding("fill", "color")),
      $(go.TextBlock, { name: "TB" },
        new go.Binding("text", "color"))
    );
   
    return myPalette;
  }

  public render() {
    return (
      <ReactPalette
        ref={this.paletteRef}
        divClassName='palette-component'
        initPalette={this.initPalette}
        nodeDataArray={this.props.nodeDataArray}
        linkDataArray={this.props.linkDataArray}
        modelData={this.props.modelData}
      />
    );
  }
}
