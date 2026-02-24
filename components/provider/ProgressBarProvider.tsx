// /Users/nemo/Desktop/attendance-management-system/components/provider/ProgressBarProvider.tsx
"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import React from "react";

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			{children}
			<ProgressBar
				height="7px"
				color="#0ea5e9"
				options={{ showSpinner: true }}
				shallowRouting
			/>
		</>
	);
};

export default ProgressBarProvider;
