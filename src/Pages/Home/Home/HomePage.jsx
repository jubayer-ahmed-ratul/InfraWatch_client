import React from 'react';
import Banner from '../Components/Banner/Banner';
import LatestResolvedIssues from '../Components/Banner/LatestResolvedIssues';
import Features from '../Components/Banner/Features';
import HowItWorks from '../Components/Banner/HowItWorks';
// import DemoCredentials from '../../../components/DemoCredentials/DemoCredentials';

const HomePage = () => {
    return (
        <div>
            <Banner></Banner>
            {/* <DemoCredentials></DemoCredentials> */}
            <LatestResolvedIssues></LatestResolvedIssues>
            <Features></Features>
            <HowItWorks></HowItWorks>
        </div>
    );
};

export default HomePage;