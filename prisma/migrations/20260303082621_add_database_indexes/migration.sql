-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Amenity_propertyId_idx" ON "Amenity"("propertyId");

-- CreateIndex
CREATE INDEX "NearbyPlace_propertyId_idx" ON "NearbyPlace"("propertyId");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");

-- CreateIndex
CREATE INDEX "Property_listingType_idx" ON "Property"("listingType");

-- CreateIndex
CREATE INDEX "Property_city_idx" ON "Property"("city");

-- CreateIndex
CREATE INDEX "Property_createdById_idx" ON "Property"("createdById");

-- CreateIndex
CREATE INDEX "Property_projectId_idx" ON "Property"("projectId");

-- CreateIndex
CREATE INDEX "Property_createdAt_idx" ON "Property"("createdAt");

-- CreateIndex
CREATE INDEX "Property_propertyType_listingType_idx" ON "Property"("propertyType", "listingType");

-- CreateIndex
CREATE INDEX "PropertyImage_propertyId_idx" ON "PropertyImage"("propertyId");

-- CreateIndex
CREATE INDEX "Reservation_userId_idx" ON "Reservation"("userId");

-- CreateIndex
CREATE INDEX "Reservation_propertyId_idx" ON "Reservation"("propertyId");

-- CreateIndex
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");

-- CreateIndex
CREATE INDEX "Reservation_createdAt_idx" ON "Reservation"("createdAt");

-- CreateIndex
CREATE INDEX "Reservation_expiresAt_idx" ON "Reservation"("expiresAt");

-- CreateIndex
CREATE INDEX "Reservation_propertyId_status_idx" ON "Reservation"("propertyId", "status");

-- CreateIndex
CREATE INDEX "Reservation_userId_status_idx" ON "Reservation"("userId", "status");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_approvalStatus_idx" ON "User"("approvalStatus");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "VerificationToken_identifier_idx" ON "VerificationToken"("identifier");

-- CreateIndex
CREATE INDEX "VerificationToken_type_idx" ON "VerificationToken"("type");
