import { Button, Container, Flex, Input, Spinner, Text,Checkbox } from "@chakra-ui/react";
import React, { useState } from "react";
import Navbar from "../components/Navbar";

import TagsInputKws from '../components/TagsInputKws'
import TagsInput2 from '../components/TagsInput2'

import { findAccess, processPredict_fromTotalFetch ,getDate} from '../utils/common'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

import SummaryView from "../components/SummaryView";
import process from "process";
import SelectOption, { SelectionMode } from "../components/SelectOption";
import { useAuth } from "../lib/auth";
const Summary = () => {
    toast.configure()
    const { auth, signOut } = useAuth();
    // const [sumView, setSumView] = useState(<Pie2 data={[]} innerRadius={100} outerRadius={0}
    //     width={300} height={300}
    // />)
    const [sumView, setSumView] = useState(<div />)
    const [num, setNum] = useState(parseInt(process.env.NEXT_PUBLIC_NUM_PREDICTIONS))
    const [numBig, setNumBig] = useState(parseInt(process.env.NEXT_PUBLIC_NUMBIG_PREDICTIONS))
    const [btnEnable, setBtnEnable] = useState(true)

    let sortBy = ''
    let tweets = []
    let today = new Date()
    let default2Date = new Date(today.setDate(today.getDate())).toISOString().split("T")[0]
    let defaultfromDate = new Date(today.setDate(today.getDate()-28)).toISOString().split("T")[0]
    
    const callbackFunction = (a) => {
        sortBy = a
    }

    const sorting = (res,sortBy) =>{
        let origSortBy = (sortBy == 'like') ? 'fav' : sortBy
        if(sortBy !== 'like' && sortBy !='retweet'){
            origSortBy = (sortBy =='date') ? 'postAt' : 'engage'
        }
        res.sort((a, b) => b[origSortBy] - a[origSortBy])
        return res
    }
    return (
        <div>
            <Head>
                <title>Text Labelling tool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Navbar />
                {(findAccess(auth,"summary")) ? (<Container position="relative" maxW="8xl">
                    <Flex my={2} align="top" justify="center" >

                        <Container mx={2} p={0}>
                            <Text>Twitter account</Text>
                            <TagsInput2 id="searchAcc" defaultEvents={[]} tags={[]} />
                        </Container>

                        <Container mx={2} p={0}>
                            <Text>Keyword</Text>
                            <TagsInputKws id="searchKeySummary" tags={[]} outsideIsAND={true} />
                        </Container>
                    </Flex>
                    <Flex my={2} align="center" justify="center" >
                        {/* <div id="isMasked">
                            {isAdmin(auth) ?
                                <Checkbox colorScheme='blue' defaultIsChecked>privacy</Checkbox>
                                : <Checkbox colorScheme='blue' defaultIsChecked isDisabled={true}>privacy</Checkbox>
                            }
                        </div> */}
                        <div id="isPremium">

                        <Checkbox colorScheme='blue' defaultChecked={true}  mx={2}
                                color={'twitter.600'}>
                            <b>PREMIUM SEARCH</b>
                        </Checkbox>
                        </div>
                        From the latest
                        <Input p={0} pl={1} ml={1} id='numTopPrediction'
                            maxW={'20'}
                            variant='filled'
                            defaultValue={numBig}
                            onChange={(event) => {
                                let a = parseInt(event.target.value)
                                if (!isNaN(a)) {
                                    setBtnEnable(true)
                                    setNumBig(a)
                                } else {
                                    toast.error('Invalid input')
                                    setBtnEnable(false)
                                }
                            }}
                        />
                        scrapped tweets, run predctions of
                        <Input p={0} pl={1} ml={1} id='numPrediction'
                            maxW={'20'}
                            variant='filled'
                            defaultValue={num}
                            onChange={(event) => {
                                let a = parseInt(event.target.value)
                                if (!isNaN(a)) {
                                    setBtnEnable(true)
                                    setNum(a)
                                } else {
                                    toast.error('Invalid input')
                                    setBtnEnable(false)
                                }
                            }}
                        />
                        <SelectOption title='with most' id='SortBy'
                            data={['date','like', 'retweet', 'comment', 'combine']}
                            init={['date']} mode={SelectionMode.ONE} colorScheme={'twitter'}
                            parentCallback={a => callbackFunction(a)}
                        />
                    </Flex>
                    <Flex  my={2} align="center" justify="center" >
                                <form>
                                    <label>From: </label>
                                    <input type="date" id='getfromDate' defaultValue={defaultfromDate} max={default2Date}></input>
                                    <label>Until:</label>
                                    <input type="date" id='gettoDate'defaultValue={default2Date} max={default2Date}></input>
                                </form>
                                
                            </Flex>
                    <Flex my={2} align="center" justify="center" >
                        <Button
                            m={3}
                            // colorScheme="blue"
                            // background="gray"
                            // color="lightgreen"
                            onClick={() => {
                                setSumView(
                                    <Flex my={2} align="center" justify="center" > Loading predictions
                                        <Spinner size="md" m={1} thickness="4px"
                                            speed="0.65s"
                                            emptyColor="gray.200"
                                            color="blue.500" />
                                    </Flex>
                                )
                                processPredict_fromTotalFetch('searchAcc', 'searchKeySummary', num, numBig, sortBy,getDate('getfromDate')
                                ,getDate('gettoDate')).then(res => {
                                    console.log(res.length)
                                    res = sorting(res,sortBy)
                                    setSumView(
                                        <SummaryView tweets={res[0]} pred_sa={res[1]} pred_ed={res[2]} />
                                    )
                                })

                            }}
                            disabled={!btnEnable}
                            colorScheme={'twitter'}
                        >
                            <p>Load & Predict & Summary</p>
                        </Button>
                    </Flex>



                    </Container>) :(
                        <Container position="relative" maxW="8xl">
                            <Text fontWeight={600} fontSize='4xl'>Please log in for start using tool</Text>
                        </Container>

                    )
                    
                    
                    }
                
                <Container position="relative" maxW="8xl" mb={10}>
                    {sumView}
                </Container>
            </main>
            <footer />
        </div>
    )

}

export default Summary