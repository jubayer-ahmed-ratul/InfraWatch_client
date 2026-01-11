import React from 'react';
import useToast from '../../hooks/useToast';

const ToastDemo = () => {
  const { showToast } = useToast();

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-lg">
        <h3 className="font-bold text-base-content mb-3">🍞 Toast Demo</h3>
        <div className="space-y-2">
          <button
            onClick={() => showToast.success('Success message!')}
            className="btn btn-success btn-sm w-full"
          >
            Success Toast
          </button>
          <button
            onClick={() => showToast.error('Error message!')}
            className="btn btn-error btn-sm w-full"
          >
            Error Toast
          </button>
          <button
            onClick={() => showToast.warning('Warning message!')}
            className="btn btn-warning btn-sm w-full"
          >
            Warning Toast
          </button>
          <button
            onClick={() => showToast.info('Info message!')}
            className="btn btn-info btn-sm w-full"
          >
            Info Toast
          </button>
          <div className="divider my-2"></div>
          <button
            onClick={() => showToast.created('New Issue')}
            className="btn btn-primary btn-sm w-full"
          >
            CRUD: Created
          </button>
          <button
            onClick={() => showToast.updated('Issue Status')}
            className="btn btn-secondary btn-sm w-full"
          >
            CRUD: Updated
          </button>
          <button
            onClick={() => showToast.deleted('Issue')}
            className="btn btn-accent btn-sm w-full"
          >
            CRUD: Deleted
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastDemo;