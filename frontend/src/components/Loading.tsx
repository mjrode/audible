import React from 'react';
import { DotLoader } from 'react-spinners';
import { css } from '@emotion/core';

const override = css`
  display: block;
  margin-top: 10em;
  /* border-color: #36d7b7; */
`;

export const Loading = ({ loading }) => {
  console.log('Loading', loading);
  return (
    <div>
      <div className="sweet-loading">
        <DotLoader
          css={override}
          size={150}
          color={'#123abc'}
          loading={loading}
        />
      </div>
    </div>
  );
};
