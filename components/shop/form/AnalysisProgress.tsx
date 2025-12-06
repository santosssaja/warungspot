import { Loader2 } from 'lucide-react'

interface AnalysisProgressProps {
    message: string
    step: string
}

export default function AnalysisProgress({ message, step }: AnalysisProgressProps) {
    return (
        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl">
            <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 text-orange-600 animate-spin" />
                <div className="flex-1">
                    <p className="font-semibold text-gray-900">{message}</p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 animate-pulse"
                            style={{
                                width: step === 'validate' ? '20%' :
                                    step === 'parse' ? '30%' :
                                        step === 'convert' ? '50%' :
                                            step === 'init' ? '60%' :
                                                step === 'ai' ? '80%' :
                                                    step === 'complete' ? '100%' : '10%'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
