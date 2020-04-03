import React from 'react';
import styled from 'styled-components';

interface AnalyseProps{
    className?: string;
}

const Analyse = styled(({className='analyse'}) => {
    return <div className={className}><h1>Analyse</h1></div>
})``;

export {Analyse};