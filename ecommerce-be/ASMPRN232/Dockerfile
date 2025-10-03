# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj và restore
COPY *.sln .
COPY ecommerce-be/*.csproj ./ecommerce-be/
RUN dotnet restore ecommerce-be/*.csproj

# copy toàn bộ và build
COPY ecommerce-be/. ./ecommerce-be/
WORKDIR /src/ecommerce-be
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "ASMPRN232.dll"]
