# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj và restore
COPY ASMPRN232/ASMPRN232.csproj ./ASMPRN232/
RUN dotnet restore ASMPRN232/ASMPRN232.csproj

# copy toàn bộ source và build
COPY ASMPRN232/. ./ASMPRN232/
WORKDIR /src/ASMPRN232
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "ASMPRN232.dll"]
