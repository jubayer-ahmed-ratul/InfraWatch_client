import React from 'react';
import Banner from '../Components/Banner/Banner';

import Statistics from '../Components/Statistics/Statistics';
import LatestResolvedIssues from '../Components/Banner/LatestResolvedIssues';
import Features from '../Components/Banner/Features';
import HowItWorks from '../Components/Banner/HowItWorks';
import FAQ from '../Components/FAQ/FAQ';
import CallToAction from '../Components/CallToAction/CallToAction';

const HomePage = () => {
    return (
        <div>
            <Banner></Banner>
            
            
            <LatestResolvedIssues></LatestResolvedIssues>
            <Features></Features>
            <HowItWorks></HowItWorks>
            <Statistics></Statistics>
            <FAQ></FAQ>
            <CallToAction></CallToAction>
        </div>
    );
};

export default HomePage;