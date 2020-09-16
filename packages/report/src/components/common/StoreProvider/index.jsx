import React from 'react';
import PropTypes from 'prop-types';

const storeContext = React.createContext(null);

const StoreProvider = ({ store, children }) => {
    return (
        <storeContext.Provider value={store}>{children}</storeContext.Provider>
    );
};

StoreProvider.propTypes = {
    store: PropTypes.shape().isRequired,
    children: PropTypes.node.isRequired,
};

export default StoreProvider;

export const useStore = () => {
    const store = React.useContext(storeContext);
    if (!store) {
        throw new Error('You have forgot to use StoreProvider, shame on you.');
    }
    return store;
};
