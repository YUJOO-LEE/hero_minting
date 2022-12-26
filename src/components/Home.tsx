import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import { Injected } from '../lib/connectors';
import { ContractInstance } from '../lib/contract';

const Home = () => {
  const [isMinting, setIsMinting] = useState(false);
  
  const {
    connector,  // 현재 dapp에 연결된 월렛의 connector 값
    library,  // web3 provider 제공
    chainId,  // dapp에 연결된 account의 chainId
    account,  // dapp에 연결된 account address
    active, // dapp 유저가 로그인 된 상태인지 체크
    error,  
    activate, // dapp 월렛 연결 기능 수행 함수
    deactivate, // dapp 월렛 연결 해제 수행 함수
  } = useWeb3React();

  const handleConnect = () => {
    if ((window as any).ethereum === undefined) {
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
      let reciept = await signedTransaction.wait();
      console.log('reciept', reciept);
      setIsMinting(false);

    } catch(error) {

      console.log('error!', error);
      setIsMinting(false);
    }
  };

  return (
    <div>
      {account &&
        <>
          <p>Account: {account}</p>
          <p>chainId: {chainId}</p>
        </>
      }
      <p>
        <button onClick={handleConnect}>
          {active ? '연결 해제' : '지갑 연결하기'}
        </button>

      {account &&
        <button
          onClick={handleMint}
          disabled={isMinting === true}
        >
          Minting
        </button>
      }
      </p>
    </div>
  )
}

export default Home;