import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Text } from '@cybercongress/gravity';

const InfoPane = ({ openTime, startTimeTot }) => {
  let content;

  const textStart = `start ${startTimeTot}`;

  switch (openTime) {
    case 'intro':
      content = textStart;
      break;
    case 'end':
      content = 'end';
      break;
    default:
      content = (
        <Pane>
          Here, you can get EUL tokens in exchange for ETH during the{' '}
          <Link to="/gol">Game of Links</Link>. The process consist of 3 steps:
          (1) Bid for GOL during the auction in the Ethereum network, (2) Claim GOL from
          a smart contract after the round ends, (3) Get 1 EUL in the Cyber network for
          each vested GOL.
        </Pane>
      );
      break;
  }

  return (
    <Pane
      boxShadow="0px 0px 5px #36d6ae"
      paddingX={20}
      paddingY={20}
      marginY={20}
    >
      <Text fontSize="16px" color="#fff">
        {content}
      </Text>
    </Pane>
  );
};

export default InfoPane;
