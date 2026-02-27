import Link from 'next/link';

export default function SettingsPage() {
    return (
        <div className="min-h-screen pb-24 relative">
            <div className="pt-8 px-6 pb-4">
                <h1 className="font-heading text-2xl font-bold">설정</h1>
            </div>

            <div className="px-6 space-y-4 mt-4">
                <div className="yuna-card">
                    <div className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer">
                        <span className="font-medium text-gray-700">내 프로필 수정</span>
                        <span className="text-gray-400">›</span>
                    </div>
                    <div className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer">
                        <span className="font-medium text-gray-700">계정 관리</span>
                        <span className="text-gray-400">›</span>
                    </div>
                </div>

                <div className="yuna-card">
                    <div className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer">
                        <span className="font-medium text-gray-700">가족 구성원 관리</span>
                        <span className="text-gray-400">›</span>
                    </div>
                    <div className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer">
                        <span className="font-medium text-gray-700">새로운 가족 초대</span>
                        <span className="text-gray-400">›</span>
                    </div>
                    <div className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer">
                        <span className="font-medium text-red-500">데이터 다운로드 (아카이브)</span>
                        <span className="text-gray-400">›</span>
                    </div>
                </div>

                <div className="pt-8 text-center">
                    <button className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
}
