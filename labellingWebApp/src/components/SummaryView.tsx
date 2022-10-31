import { Box, Button, Checkbox, Container, Divider, Flex, Grid, SimpleGrid, Spinner, Tag, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
    getDefaultEventList,
    loadUnlabelledPostByAccount,
    refillDb_acc,
    updateLabel,
    loadUnlabelledPost_accs_kws,
    refillDb_kw,
    refillDb_acc_kws, loadLabelledPostByLabelledBy, getDefaultKws
} from '../utils/db';
import { useAuth } from "../lib/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import {
    calcAmountSummary,
    sentimentFullList,
    eventFullList
} from "../utils/common";
import Pie2 from './Pie2';
import BarChartWrapper from "./BarChartWrapper";


interface Props {

    tweets,
    pred_sa,
    pred_ed,

}

class SummaryView extends React.Component<Props> {

    state = {
        id: 'SummaryView',

        refreshing: false,
        tweets: this.props.tweets,
        pred_sa: this.props.pred_sa,
        pred_ed: this.props.pred_ed,
        width: 300,
        height: 300,


    }

    // plotly = require('plotly')('tomtran102', '93nUHvtu3eN68NFXfb8t')
    // plot() {
    //     var trace1 = {
    //         x: ["giraffes", "orangutans", "monkeys"],
    //         y: [20, 14, 23],
    //         name: "SF Zoo",
    //         type: "bar"
    //     };
    //     var trace2 = {
    //         x: ["giraffes", "orangutans", "monkeys"],
    //         y: [12, 18, 29],
    //         name: "LA Zoo",
    //         type: "bar"
    //     };
    //     var data = [trace1, trace2];
    //     var layout = { barmode: "stack" };
    //     var graphOptions = { layout: layout, filename: "stacked-bar", fileopt: "overwrite" };
    //     this.plotly.plot(data, graphOptions, function (err, msg) {
    //         console.log(msg);
    //     });
    // }


    render() {
        console.log(`${this.state.id}::render`)

        // console.log(`this.plotly=${this.plotly}`)


        // this.plot()
        let summary = calcAmountSummary(this.props.pred_sa, sentimentFullList, true)
        let countED = calcAmountSummary(this.props.pred_ed.flat(), eventFullList, false)
        let result =[]
        let tmpResult=[]
        if(this.state.tweets.length==0){
            return '' 
        }

        result.push(<Text mt={4}>Among the {this.state.tweets.length} tweets, there are predicted to have</Text>)
        
        let sumList = []
        for (const i in summary) {
            sumList.push({ name: i, value: summary[i] })
            let color = ''
            if (i == sentimentFullList[0]) color='red'
            else if (i == sentimentFullList[1]) color='yellow'
            else color='green'
            tmpResult.push(<Flex align="center" justify="center" mr={2} p={0}>{(summary[i] * 100).toFixed(2)}% <Tag colorScheme={color} variant="solid" borderRadius={100} mx={1}>{i}</Tag></Flex>)
        }
        result.push(
            <Flex flexDirection="row" flexWrap="wrap"
                              align="center" justify="center" pb={3}>
                {tmpResult}
            </Flex>
        )
        for (let c in countED){
            // console.log(`${countED[c]}`)
            if (countED[c]>0)
                result.push(<Flex align="center" justify="center" m={0.5}><Tag colorScheme={'orange'} m={0.5} variant="solid" borderRadius={100} mx={1}>{c}</Tag> is detected in {countED[c]} tweets</Flex>)
        }
        console.log(sumList)
        // this.displayResult = this.displayPredicts()
        return (
            <div>
                <Container id='pie' align="center" justify="center" maxW={'8xl'}>
                    <div>
                        {result}
                    </div>
                    <Flex flexDirection="row" flexWrap="wrap"  >
                        {/* <Container id='pie' align="center" justify="top"> */}
                        <Pie2 data={sumList} innerRadius={0} outerRadius={Math.min(this.state.height, this.state.width) / 2}
                            width={this.state.width} height={this.state.height} />


                        {/* </Box ></Flex> */}

                        <BarChartWrapper pred_sa={this.props.pred_sa} pred_ed={this.props.pred_ed}/>



                    </Flex>
                </Container>

            </div >

        );
    }
}


export default SummaryView;