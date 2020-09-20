import React from 'react'
import ProTypes from "prop-types";
import ReactLoading from 'react-loading';

class ReactCustomLoading extends React.Component
{
    render()
    {
        return <div>
            {this.props.isLoading? <div className="myLoading"><ReactLoading type="spin" color="#33cabb"height="64px" className="center-middle" width="64px" /></div>:""}
        </div>
    }
}

ReactCustomLoading.proTypes  = {
  isLoading:ProTypes.bool.isRequired
};

export default ReactCustomLoading;