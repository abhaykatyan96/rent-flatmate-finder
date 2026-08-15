const fallbackScore = (listing, tenant) => {

    let score = 0;

    if (
        listing.location.toLowerCase() ===
        tenant.preferredLocation.toLowerCase()
    )
        score += 40;

    if (
        listing.rent >= tenant.minBudget &&
        listing.rent <= tenant.maxBudget
    )
        score += 40;

    const days =
        Math.abs(
            new Date(listing.availableFrom) -
            new Date(tenant.moveInDate)
        ) /
        (1000 * 60 * 60 * 24);

    if (days <= 30)
        score += 20;

    return {
        score,
        explanation:
            "Generated using fallback compatibility algorithm."
    };

};

export default fallbackScore;