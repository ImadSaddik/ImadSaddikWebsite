import httpx

from logger import logger
from models.visitor import IpAPIResponse


async def get_country_and_check_bot_from_ip(ip_address: str) -> IpAPIResponse:
    if ip_address == "127.0.0.1":
        return IpAPIResponse(country="Local", is_bot=False)

    url = f"https://api.ipapi.is/?q={ip_address}"
    async with httpx.AsyncClient() as client:
        try:
            timeout_seconds = 5.0
            response = await client.get(url=url, timeout=timeout_seconds)
            response.raise_for_status()
            data = response.json()

            if "error" in data:
                logger.warning(f"ipapi.is returned an error for IP {ip_address}: {data['error']}")
                return IpAPIResponse(country=None, is_bot=False)

            if data.get("is_proxy") or data.get("is_abuser") or data.get("is_crawler"):
                logger.info(f"API flagged bot (proxy/abuser/crawler): {ip_address}")
                location = data.get("location")
                country = location.get("country") if location else None
                return IpAPIResponse(country=country, is_bot=True)

            real_users_company_type = "isp"
            company_type = data.get("company", {}).get("type")
            if company_type and company_type.lower() != real_users_company_type:
                logger.info(f"API flagged non-ISP type ({company_type}): {ip_address}")
                location = data.get("location")
                country = location.get("country") if location else None
                return IpAPIResponse(country=country, is_bot=True)

            location = data.get("location")
            if location and "country" in location:
                return IpAPIResponse(country=location["country"], is_bot=False)

            return IpAPIResponse(country=None, is_bot=False)
        except Exception as e:
            logger.exception(f"Error calling ipapi.is: {e}")
            return IpAPIResponse(country=None, is_bot=False)
