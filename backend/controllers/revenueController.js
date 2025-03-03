const commissions = {
    seller: 0.1, // 10%
    admin: 0.05, // 5%
    rider: 0.03  // 3%
};

const calculateRevenue = (amount, commission) => {
    return amount * commission;
};

export const getSellerRevenue = (req, res) => {
    const amount = parseFloat(req.params.amount);
    const revenue = calculateRevenue(amount, commissions.seller);
    res.json({ commission: commissions.seller, revenue });
};

export const getAdminRevenue = (req, res) => {
    const amount = parseFloat(req.params.amount);
    const revenue = calculateRevenue(amount, commissions.admin);
    res.json({ commission: commissions.admin, revenue });
};

export const getRiderRevenue = (req, res) => {
    const amount = parseFloat(req.params.amount);
    const revenue = calculateRevenue(amount, commissions.rider);
    res.json({ commission: commissions.rider, revenue });
};