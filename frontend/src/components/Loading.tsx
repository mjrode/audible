import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/core';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export const Loading = ({ loading }) => {
  return (
    <div>
      <div className="sweet-loading">
        <ClipLoader
          css={override}
          size={150}
          color={'#123abc'}
          loading={loading}
        />
      </div>
    </div>
  );
};
