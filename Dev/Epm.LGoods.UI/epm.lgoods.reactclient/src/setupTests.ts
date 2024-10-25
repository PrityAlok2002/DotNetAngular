import '@testing-library/jest-dom';

import Modal from 'react-modal';

// Create a root element for React Modal
const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

Modal.setAppElement('#root');