import { Box, Button, ButtonGroup, Flex, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { Injected } from './lib/connectors';
import { ContractInstance } from './lib/contract';

const App = () => {
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [Balance, setBalance] = useState<string>('0');
  
  const {
    library,  // web3 provider 제공
    chainId,  // dapp에 연결된 account의 chainId
    account,  // dapp에 연결된 account address
    active, // dapp 유저가 로그인 된 상태인지 체크
    activate, // dapp 월렛 연결 기능 수행 함수
    deactivate, // dapp 월렛 연결 해제 수행 함수
  } = useWeb3React();

  const handleConnect = () => {
    if (!window.ethereum) {
      // 지갑 미설치 상태라면 설치 페이지 오픈
      window.open(
        `https://metamask.app.link/dapp/${window.location.host}`,
        '_blank'
      );
      return;
    }
    if (active && account) {
      deactivate();
      // 연결되어있는 상태라면 연결해제
    }
    activate(Injected);
    // Injected 넘겨줌
  }

  const handleMint = async () => {
    try{
      const data = await ContractInstance.populateTransaction.summon();
      setIsMinting(true);
      const signer = library.getSigner(); // 계정 잠금해제
      const signedTransaction = await signer.sendTransaction(data);
      // 잠금해제된 계정으로, 트랜잭션 구조 객체를 담아서 트랜잭션 전송
      const reciept: Object = await signedTransaction.wait();
      console.log('reciept', reciept);

    } catch(error: unknown) {
      console.error('error!', error);
    }

    setIsMinting(false);
    balanceOf();
  };

  const balanceOf = async () => {
    try{
      const data: BigInt = await ContractInstance.balanceOf(account);
      setBalance(data.toString());
    } catch(error: unknown) {
      console.error('error!', error);
    }
  };

  useEffect(() => {
    if (!account) return;
    balanceOf();
  }, [account]);

  return (
    <Flex w='100%' h='100vh' direction='column' justifyContent='center' alignItems='center'>
      {account &&
        <Box mb={10}>
          <Text>Account: {account}</Text>
          <Text>chainId: {chainId}</Text>
          <Text>balance: {Balance}</Text>
        </Box>
      }
      <ButtonGroup>
        <Button onClick={handleConnect}
          colorScheme={active ? 'gray' : 'blue'}
        >
          {active ? '연결 해제' : '지갑 연결하기'}
        </Button>

      {account &&
        <Button
          onClick={handleMint}
          disabled={isMinting === true}
          isLoading={isMinting}
          colorScheme='blue'
        >
          Minting
        </Button>
      }
      </ButtonGroup>
    </Flex>
  )
}

export default App;
