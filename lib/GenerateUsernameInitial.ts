export const getInitialsName = (name: string) => {
	if (!name) return "CN"; // နာမည်မရှိရင် default ပေးထားမယ်

	const nameParts = name.trim().split(" ");
	if (nameParts.length > 1) {
		// ပထမစာလုံးနဲ့ နောက်ဆုံးစာလုံးရဲ့ အရှေ့ဆုံး characters တွေကို ယူမယ်
		return (
			nameParts[0][0] + nameParts[nameParts.length - 1][0]
		).toUpperCase();
	}

	// နာမည်က တစ်လုံးတည်းဆိုရင် အရှေ့ဆုံး ၂ လုံးကို ယူမယ်
	return nameParts[0].substring(0, 2).toUpperCase();
};
