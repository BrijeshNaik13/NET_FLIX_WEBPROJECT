function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="spinner w-16 h-16 border-4 border-gray-800 border-t-netflix-red" />
                <p className="text-gray-400 text-lg">Loading movies...</p>
            </div>
        </div>
    )
}

export default LoadingSpinner
