// tslint:disable quotemark no-implicit-dependencies
import { Table } from 'antd';
import styled from 'styled-components';

export const StyledTable: any = styled(Table)`
    &.ant-table-wrapper {
        thead > tr > th {
            //background: rgba(229, 236, 235, 0.6);
            // background: #DF5D43;
            background: #F8F8F8;
            // color: #999999;
            // color: #FFFFFF;
            color:#666666;
            &:first-child{
                border-radius: 10px 0 0 10px !important;
            }
            &:last-child {
                border-radius: 0 10px 10px 0 !important;
            }
        } 
    }
    &.col_alt_color {
        thead > tr > th {
            background: #fff;
        }
        tbody > tr > td {
            background: #fff;
        }
        div {
            background: transparent;
        }
        .odd_col {
            background: #eff7f7 0% 0% no-repeat padding-box;
        }
    }
`;
