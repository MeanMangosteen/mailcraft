import React from 'react';
import styled from 'styled-components';

interface DeclutterProps {
    className?: string;
}

const Declutter = styled(({className='declutter'}) => {
    return <div className={className}></div>
})``;

export {Declutter};