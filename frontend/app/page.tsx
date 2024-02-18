import dynamic from "next/dynamic";

const StageComponent = dynamic(() => import('./_components/stageComponent'), {ssr: false})
export default function Home() {
  return (
    <>
      <StageComponent />
    </>
  );
}
