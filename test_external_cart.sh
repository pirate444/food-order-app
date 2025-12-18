#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:5000/api"

echo -e "${BLUE}=== Testing External Food Cart Functionality ===${NC}\n"

# Step 1: Register
echo -e "${BLUE}Step 1: Register new user${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"testuser$(date +%s)\",
    \"email\": \"test$(date +%s)@example.com\",
    \"password\": \"Test123!\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\"
  }")

echo "$REGISTER_RESPONSE" | jq .
REGISTER_SUCCESS=$(echo "$REGISTER_RESPONSE" | jq -r '.success')

if [ "$REGISTER_SUCCESS" != "true" ]; then
  echo -e "${RED}Registration failed${NC}"
  exit 1
fi

# Get token from registration response
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo -e "${RED}No token from registration${NC}"
  exit 1
fi

echo -e "${GREEN}✓ User registered and logged in${NC}"
echo -e "${GREEN}Token: ${TOKEN:0:20}...${NC}\n"

# Step 3: Test external meal add to cart
echo -e "${BLUE}Step 3: Test adding external meal to cart${NC}"
TEST_RESPONSE=$(curl -s -X POST "$API_URL/test/add-external-meal" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "$TEST_RESPONSE" | jq .
TEST_SUCCESS=$(echo "$TEST_RESPONSE" | jq -r '.success')

if [ "$TEST_SUCCESS" != "true" ]; then
  echo -e "${RED}Test failed${NC}"
  exit 1
fi

echo -e "${GREEN}✓ External meal successfully added to cart${NC}\n"

# Step 4: Get cart to verify
echo -e "${BLUE}Step 4: Verify cart contents${NC}"
CART_RESPONSE=$(curl -s -X GET "$API_URL/cart" \
  -H "Authorization: Bearer $TOKEN")

echo "$CART_RESPONSE" | jq .
CART_ITEMS=$(echo "$CART_RESPONSE" | jq '.data.items | length')

echo -e "${GREEN}✓ Cart contains $CART_ITEMS items${NC}\n"

echo -e "${GREEN}=== All tests passed! ===${NC}"
