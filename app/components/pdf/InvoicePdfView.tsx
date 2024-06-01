'use client';

import { FC } from 'react';
import { StyledPdfViewer } from './styled';
import { IProps } from './types';

const InvoicePdfView: FC<IProps> = ({ src }) => {
    return <StyledPdfViewer data={src}>PDF Page with Invoice should be here</StyledPdfViewer>;
};

export default InvoicePdfView;
