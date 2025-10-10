import httpx
from logger import logger


async def get_country_from_ip(ip_address: str) -> str | None:
    if ip_address == "127.0.0.1":
        return "Local"

    url = f"https://api.ipapi.is/?q={ip_address}"
    async with httpx.AsyncClient() as client:
        try:
            timeout_seconds = 5.0
            response = await client.get(url=url, timeout=timeout_seconds)
            response.raise_for_status()
            data = response.json()

            if "error" in data:
                logger.warning(
                    f"ipapi.is returned an error for IP {ip_address}: {data['error']}"
                )
                return None

            location = data.get("location")
            if location and "country" in location:
                return location["country"]

            return None
        except (httpx.RequestError, httpx.HTTPStatusError) as e:
            logger.error(f"Error calling ipapi.is: {e}")
            return None
