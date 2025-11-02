import logging
import sys

uvicorn_access = logging.getLogger("uvicorn.access")
uvicorn_access.disabled = True

logger = logging.getLogger("uvicorn")
logger.setLevel(logging.getLevelName(logging.DEBUG))

handler = logging.StreamHandler(sys.stdout)
logger.addHandler(handler)
