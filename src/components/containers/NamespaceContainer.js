import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
// import * as actions from '../../actions/fuelSavingsActions';
import NamespacePage from '../NamespacePage';

// export class NamespaceContainer extends React.Component {
  // saveFuelSavings = () => {
  //   this.props.actions.saveFuelSavings(this.props.fuelSavings);
  // }

  // calculateFuelSavings = e => {
  //   this.props.actions.calculateFuelSavings(this.props.fuelSavings, e.target.name, e.target.value);
  // }

//   render() {
//     return (
//       <FuelSavingsForm
//         onSaveClick={this.saveFuelSavings}
//         onChange={this.calculateFuelSavings}
//         fuelSavings={this.props.fuelSavings}
//       />
//     );
//   }
// }

// NamespaceContainer.propTypes = {
//   actions: PropTypes.object.isRequired,
//   fuelSavings: PropTypes.object.isRequired
// };

function mapStateToProps(state) {
  return {
    hello: '',
    // fuelSavings: state.fuelSavings
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createNamespace: () => {}
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NamespacePage);
