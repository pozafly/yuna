export default function InvitePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
            <div className="w-20 h-20 bg-peach-accent rounded-full mb-6 flex items-center justify-center shadow-lg">
                <span className="text-3xl">💌</span>
            </div>

            <h1 className="font-heading text-2xl font-bold mb-2">
                가족의 초대가 도착했어요!
            </h1>
            <p className="text-gray-500 mb-8 text-sm">
                초대받은 아기의 사진첩에 참여하시겠어요?
            </p>

            <div className="w-full yuna-card p-6 space-y-4">
                <button className="w-full yuna-button-primary">
                    초대 수락하고 시작하기
                </button>
                <button className="w-full text-sm text-gray-400 font-medium py-2">
                    나중에 하기
                </button>
            </div>
        </div>
    );
}
