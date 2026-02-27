import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
            <div className="w-24 h-24 bg-primary rounded-3xl mb-8 flex items-center justify-center rotate-12 shadow-lg">
                <span className="text-4xl text-white font-handwriting">Y</span>
            </div>

            <h1 className="font-heading text-4xl font-bold mb-4">
                Yuna's Day
            </h1>
            <p className="text-gray-500 mb-12">
                우리가족만의 프라이빗한<br />
                아기 성장 기록
            </p>

            <div className="w-full space-y-4">
                <Link
                    href="/login"
                    className="block w-full yuna-button-primary"
                >
                    시작하기
                </Link>
            </div>
        </div>
    );
}
