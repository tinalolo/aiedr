import * as React from 'react';
import isempty from 'lodash.isempty';

export const isEmptyData = (data: [] | {}) => {
    return isempty(data);
}