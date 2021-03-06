import React, { Component } from 'react';
import { ActionBar, Button, Input, Pane } from '@cybercongress/gravity';
import { ClaimedAll } from './claimedAll';
import { AUCTION } from '../../utils/config';

function lament(error) {
  if (error) {
    document.querySelector('.before-error').outerHTML += `
      <div class="error pane">
        <h3>${error.message}</h3>
        <pre>${error.stack}</pre>
      </div>
    `;
  }
}

const hopefully = $ => (error, result) => {
  if (error) {
    lament(error);
  } else {
    $(result);
  }
};

const ping = tx =>
  new Promise((resolve, reject) => {
    loop();
    function loop() {
      window.web3.eth.getTransactionReceipt(tx, async (error, receipt) => {
        if (receipt == null) {
          resolve(receipt);
        } else {
          setTimeout(loop, 1000);
        }

        if (receipt) {
          resolve(receipt);
        } else {
          setTimeout(loop, 1000);
        }
      });
    }
  });

// const Input = ({
//   value,
//   onChange,
//   placeholder,
//   valid,
//   messageError,
//   ...props
// }) => (
//   <div {...props} className="input-box-valid">
//     <input
//       style={{ textAlign: 'end' }}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//     />
//     {valid && <span className="errorMessage">{messageError}</span>}
//   </div>
// );

const ActionBarContentText = ({ children, ...props }) => (
  <Pane
    display="flex"
    fontSize="20px"
    justifyContent="center"
    alignItems="center"
    flexGrow={1}
    marginRight="15px"
    {...props}
  >
    {children}
  </Pane>
);

const ContributeETH = ({
  onClickBtn,
  valueRound,
  valueAmount,
  onChangeAmount,
  onChangeRound,
  disabledBtnConfirm,
  validRound,
  validAmount,
  messageRound,
  messageAmount,
}) => (
  <ActionBar>
    <ActionBarContentText>
      I want to contribute
      <Input
        value={valueAmount}
        onChange={onChangeAmount}
        // placeholder={`сhoose round ${minValueRound} to ${maxValueRound}`}
        isInvalid={validAmount}
        message={messageAmount}
        marginLeft={15}
        marginRight={5}
        width="15%"
        textAlign="end"
        // style={{
        //   width: '15%',
        //   margin: '0 5px 0 15px'
        // }}
      />
      <span>ETH in</span>
      <Input
        value={valueRound}
        onChange={onChangeRound}
        // placeholder={`сhoose round ${minValueRound} to ${maxValueRound}`}
        isInvalid={validRound}
        message={messageRound}
        width="10%"
        marginLeft={15}
        marginRight={10}
        textAlign="end"
        // style={{
        //   width: '10%',
        //   margin: '0 10px 0 15px'
        // }}
      />
      <span>round</span>
    </ActionBarContentText>
    <Button disabled={disabledBtnConfirm} onClick={onClickBtn}>
      Confirm
    </Button>
  </ActionBar>
);

const Succesfuuly = ({ onClickBtn, hash }) => (
  <ActionBar>
    <ActionBarContentText flexDirection="column">
      <div className="text-default">
        Your TX has been broadcast to the network. It is waiting to be mined &
        confirmed.
      </div>
      <div className="text-default">
        Check TX status:{' '}
        <a
          className="hash"
          href={`https://etherscan.io/tx/${hash}`}
          target="_blank"
        >
          {hash}
        </a>
      </div>
    </ActionBarContentText>
    <Button onClick={onClickBtn}>OK</Button>
  </ActionBar>
);

const timer = func => {
  setInterval(func, 1000);
};

class ActionBarAuction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'start',
      round: '',
      amount: '',
      tx: null,
      messageRound: '',
      messageAmount: '',
      validInputRound: false,
      validInputAmount: false,
    };
    this.smart = AUCTION.ADDR_SMART_CONTRACT;
  }

  componentDidMount() {
    const { minRound } = this.props;

    this.setState({
      round: minRound,
    });
  }

  onChangeRound = e => {
    const { minRound, maxRound } = this.props;

    if (
      Math.floor(parseFloat(e.target.value)) < minRound ||
      Math.floor(parseFloat(e.target.value)) > maxRound
    ) {
      this.setState({
        validInputRound: true,
        messageRound: `enter round ${minRound} to ${maxRound}`,
      });
    } else {
      this.setState({
        validInputRound: false,
        messageRound: '',
      });
    }
    this.setState({
      round: e.target.value,
    });
  };

  onChangeAmount = e =>
    this.setState({
      amount: e.target.value,
    });

  onClickFuckGoogle = async () => {
    const { minRound, web3 } = this.props;
    if (web3.currentProvider.host)
      return console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable();
        if (accounts.length) {
          // console.log(accounts[0]);
          this.setState({
            step: 'start',
            round: minRound,
          });
        }
      } catch (error) {
        console.log('You declined transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        // console.log(accounts[0]);
        this.setState({
          step: 'start',
          round: minRound,
        });
      }
    } else return console.log('Your metamask is locked!');
  };

  onClickSaveAddress = () => {
    const { update, minRound } = this.props;
    this.setState({
      step: 'start',
      round: minRound,
      amount: '',
    });
    if (update) {
      update();
    }
  };

  buyTOKEN = async account => {
    const { web3, contract } = this.props;
    const { round, amount } = this.state;
    console.log(round);
    console.log(amount);

    const getData = await contract.methods.buyWithLimit(round, 0).encodeABI();

    const priceInWei = await web3.utils.toWei(amount, 'ether');
    web3.eth.sendTransaction(
      {
        from: account,
        to: this.smart,
        value: priceInWei,
        data: getData,
      },
      hopefully(result =>
        ping(result).then(() => {
          this.setState({
            step: 'succesfuuly',
            tx: result,
          });
        })
      )
    );
  };

  onClickContributeATOMs = async () => {
    const { web3 } = this.props;
    if (web3.currentProvider.host)
      return console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable();
        if (accounts.length) {
          // console.log(accounts[0]);
          this.buyTOKEN(accounts[0]);
        }
      } catch (error) {
        console.log('You declined transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        // console.log(accounts[0]);
        this.buyTOKEN(accounts[0]);
      }
    } else return console.log('Your metamask is locked!');
  };

  onClickTransactionCost = () =>
    this.setState({
      step: 'succesfuuly',
    });

  render() {
    const {
      step,
      round,
      amount,
      tx,
      messageRound,
      messageAmount,
      validInputRound,
      validInputAmount,
    } = this.state;
    const {
      minRound,
      maxRound,
      web3,
      startAuction,
      claimed,
      contract,
      accounts,
    } = this.props;

    const btnConfirm =
      parseFloat(round) >= parseFloat(minRound) &&
      parseFloat(round) <= parseFloat(maxRound) &&
      parseFloat(amount) > 0;

    if (web3.givenProvider === null)
      return (
        <ActionBar>
          <ActionBarContentText>
            <span>Please install the</span>
            &nbsp;
            <a href="https://metamask.io/" target="_blank">
              Metamask extension
            </a>
            &nbsp;
            <span>and refresh the page</span>
          </ActionBarContentText>
        </ActionBar>
      );

    if (accounts === undefined && web3.givenProvider !== null) {
      return (
        <ActionBar>
          <Button onClick={this.onClickFuckGoogle}>Connect account</Button>
        </ActionBar>
      );
    }

    if (minRound > maxRound)
      return (
        <ActionBar>
          <ActionBarContentText>
            The Auction is finished. You have 3 months to claim GOL tokens. Else, the
            tokens will be burned.
          </ActionBarContentText>
          {claimed && (
            <ClaimedAll contract={contract} web3={web3} marginX={15}>
              Claim All
            </ClaimedAll>
          )}
        </ActionBar>
      );

    if (step === 'start') {
      return (
        <ContributeETH
          valueRound={round}
          valueAmount={amount}
          validRound={validInputRound}
          validAmount={validInputAmount}
          messageRound={messageRound}
          messageAmount={messageAmount}
          onChangeAmount={this.onChangeAmount}
          onChangeRound={this.onChangeRound}
          minValueRound={minRound}
          maxValueRound={maxRound}
          onClickBtn={this.onClickContributeATOMs}
          disabledBtnConfirm={!btnConfirm}
        />
      );
    }

    if (step === 'succesfuuly') {
      return <Succesfuuly hash={tx} onClickBtn={this.onClickSaveAddress} />;
    }

    return null;
  }
}

export default ActionBarAuction;
